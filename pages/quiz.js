import Airtable from "airtable";
import {Col, Form, Layout, message, Result, Row, Spin, Tag} from "antd";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import {find, reduce} from "lodash";
import Head from "next/head";
import Image from "next/image";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {QuizQuestionCard} from "../components/quizQuestionCard";
import {firestore} from "../firebase/firebaseConfig";
import {getSectorColor} from "./api/utils";

var quizAirtableBase = new Airtable({
  apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY,
}).base("appz764hf49mnGmWd");

var userAirtableBase = new Airtable({
  apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY,
}).base("appGvUYRblYB4Inww");

const userBase = userAirtableBase("Users");
const quizBase = quizAirtableBase("Quiz");

const {Header, Content} = Layout;

const QuizPage = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [userDetails, setUserDetails] = useState({});
  const [quizSettings, setQuizSettings] = useState({});
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [displayLoader, setDisplayLoader] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      router.push("/");
    } else {
      getUserDetails(true);
      getquizSettings();
      getQuizQuestions();
    }
  }, []);

  useEffect(() => {
    const userId = setInterval(async () => {
      await getUserDetails();
    }, 300000);

    const quizSettingsId = setInterval(async () => {
      await getquizSettings();
    }, 20000);

    const logoutId = setTimeout(async () => {
      await handleLogout();
    }, 900000);

    return () => {
      clearInterval(userId);
      clearInterval(quizSettingsId);
      clearTimeout(logoutId);
    };
  }, []);

  useEffect(() => {
    console.log(quizQuestions);
  }, [quizQuestions]);

  const getUserDetails = async (showLoader) => {
    showLoader && setDisplayLoader(true);
    const user = JSON.parse(localStorage.getItem("user"));
    const docRef = doc(firestore, "quiz_user", String(user.ITS_ID));
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      showLoader && setDisplayLoader(false);
      message.info("quiz session has ended");
      handleLogout();
    } else {
      setUserDetails(docSnap.data());
      showLoader && setDisplayLoader(false);
    }
  };

  const getQuizQuestions = async () => {
    const questions = [];
    const querySnapshot = await getDocs(
      collection(firestore, "quiz_questions")
    );
    querySnapshot.forEach((doc) => {
      questions.push({...doc.data()});
    });
    setQuizQuestions(questions);
  };

  const uploadQuizQuestions = async () => {
    const finalData = [];
    const questions_id = [];
    setDisplayLoader(true);

    const querySnapshot = await getDocs(
      collection(firestore, "quiz_questions")
    );
    querySnapshot.forEach((doc) => {
      questions_id.push(doc.id);
    });

    await questions_id.map(async (val) => {
      await deleteDoc(doc(firestore, "quiz_questions", val));
    });

    await quizBase
      .select({
        maxRecords: 1200,
        view: "Grid view",
        pageSize: 100,
      })
      .eachPage(
        function page(records, fetchNextPage) {
          records.forEach(function (record) {
            finalData.push(record);
          });

          fetchNextPage();
        },
        async function done(err) {
          await finalData.map(async (val) => {
            await setDoc(
              doc(firestore, "quiz_questions", val.fields.question_id),
              {...val.fields}
            );
          });
          await getQuizQuestions();
          setDisplayLoader(false);
          if (err) {
            console.error(err);
            return;
          }
        }
      );
  };

  const getquizSettings = async () => {
    const querySnapshot = await getDocs(collection(firestore, "quiz_settings"));
    querySnapshot.forEach((doc) => {
      setQuizSettings({
        id: doc.id,
        ...doc.data(),
      });
    });
  };

  const handleLogout = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      localStorage.clear();
      router.push("/");
    }
  };

  const onFinish = async (values) => {
    setDisplayLoader(true);

    let ansKeys = Object.keys(values).map((val) => val.split("_")[0]);
    let scoreArr = ansKeys.map((val) => {
      let answer = find(quizQuestions, {question_id: val});
      return answer.correct_option === values[val + "_answer"] ? 1 : 0;
    });
    let score = reduce(scoreArr, (sum, n) => sum + n, 0);

    await updateDoc(doc(firestore, "quiz_user", String(userDetails.ITS_ID)), {
      ...values,
      score: score,
      is_quiz_submitted: true,
    });

    await getUserDetails();

    setDisplayLoader(false);
  };

  return (
    <Layout>
      <Head>
        <title>Tahfeez Quiz</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header className="h-20 p-0 flex px-4 items-center fixed top-0 w-full z-10">
        <Image src="/logo.png" alt="logo" width={50} height={50} />
        <p className="whitespace-nowrap ml-2 text-lg text-white text-ellipsis overflow-hidden flex-grow">
          Tahfeez Quiz
        </p>
        <div>
          <button
            onClick={handleLogout}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-0 px-4 border border-blue-700 rounded h-10 flex items-center justify-center"
          >
            <span>Logout</span>
          </button>
        </div>
      </Header>
      {displayLoader ? (
        <div className="absolute z-50 top-0 left-0 w-screen h-screen bg-white/70 flex items-center justify-center">
          <Spin size="large" />
        </div>
      ) : null}
      <Content className="flex-grow pt-20 min-h-screen overflow-y-auto px-4">
        <Row gutter={[16, 16]} className="my-4">
          <Col xs={24}>
            <div className="flex flex-col">
              <span>Name:</span>
              <p className="text-lg">
                {userDetails && userDetails.Full_Name
                  ? userDetails.Full_Name
                  : ""}
              </p>
            </div>
          </Col>
          <Col xs={16} md={8}>
            <div className="flex flex-col">
              <span>Mohallah:</span>
              <div>
                {userDetails && userDetails.Sector ? (
                  <Tag
                    className="text-lg"
                    color={getSectorColor(userDetails.Sector)}
                  >
                    {userDetails.Sector}
                  </Tag>
                ) : null}
              </div>
            </div>
          </Col>
          {quizQuestions.length > 0 ? (
            <Col xs={8}>
              <div className="flex flex-col">
                <span>Score:</span>
                <p className="text-3xl font-medium">
                  {userDetails && userDetails.score
                    ? userDetails.score + " / " + quizQuestions.length
                    : "0 / " + quizQuestions.length}
                </p>
              </div>
            </Col>
          ) : null}

          {userDetails.is_admin ? (
            <Col xs={16} md={8}>
              <button
                onClick={uploadQuizQuestions}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-0 px-4 border border-blue-700 rounded h-10 flex items-center justify-center w-full"
              >
                <span>Upload Questions</span>
              </button>
            </Col>
          ) : null}
        </Row>
        <div className="w-full flex flex-col">
          <Row>
            <Col xs={24}>
              <img
                className="w-full h-auto my-4"
                src="/tilawat.png"
                alt="logo"
              />
            </Col>
          </Row>

          <Form
            name="quizForm"
            onFinish={onFinish}
            layout="vertical"
            form={form}
          >
            {quizSettings.is_quiz_live ? (
              <>
                {quizQuestions.map((val) => {
                  const title = (
                    <div>
                      <p className="text-2xl mb-8 font-semibold text-right text font-arabic break-normal whitespace-normal">
                        {val.question}
                      </p>
                      <p className="text-2xl font-normal  text-left break-normal whitespace-normal ">
                        {val.english_question}
                      </p>
                    </div>
                  );
                  return (
                    <QuizQuestionCard
                      isQuizSubmitted={userDetails.is_quiz_submitted}
                      selectedValue={userDetails[val.question_id + "_answer"]}
                      showAnswer={quizSettings.show_answers}
                      title={title}
                      {...val}
                      key={val.question_id}
                    />
                  );
                })}
                {userDetails.is_quiz_submitted ||
                quizSettings.show_answers ? null : (
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-4 px-4 border border-blue-700 rounded flex items-center justify-center text-2xl w-full my-8"
                  >
                    Submit Answers
                  </button>
                )}
              </>
            ) : (
              <>
                <Row gutter={[16, 16]}>
                  <Col xs={24}>
                    <img
                      className="w-full h-auto"
                      src="/tilawat1.png"
                      alt="logo"
                    />
                  </Col>

                  <Col xs={24}>
                    <img
                      className="w-full h-auto"
                      src="/tilawat2.png"
                      alt="logo"
                    />
                  </Col>
                </Row>
                <div className="w-auto h-48 mt-4">
                  <h1 className="text-center text-2xl font-medium">
                    Quiz will Begin Shortly!!
                  </h1>
                </div>
              </>
              // <Result status="404" title="Quiz will begin shortly!" />
            )}
          </Form>
        </div>
      </Content>
    </Layout>
  );
};

export default QuizPage;
