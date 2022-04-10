import Airtable from "airtable";
import {Col, Layout, message, Result, Row, Spin, Tag} from "antd";
import Head from "next/head";
import Image from "next/image";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {QuizQuestionCard} from "../components/quizQuestionCard";
import {getSectorColor} from "./api/utils";

var userAirtableBase = new Airtable({
  apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY,
}).base("appGvUYRblYB4Inww");

var quizAirtableBase = new Airtable({
  apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY,
}).base("appz764hf49mnGmWd");

const userBase = userAirtableBase("Users");
const quizBase = quizAirtableBase("Quiz");

const {Header, Content} = Layout;

const QuizPage = () => {
  const router = useRouter();

  const [userDetails, setUserDetails] = useState({});
  const [quizDetails, setQuizDetails] = useState([]);
  const [displayLoader, setDisplayLoader] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      router.push("/");
    } else {
      getUserDetails();
      getQuizDetails();
    }
  }, []);

  useEffect(() => {
    const id = setInterval(async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      const finalData = [];

      const aTData = await userBase
        .select({
          view: "Grid view",
          filterByFormula: `({its_id} = '${user.ITS_ID}')`,
        })
        .firstPage();
      if (!aTData.length) {
        message.info("quiz session has ended");
        handleLogout();
      } else {
        setUserDetails({...aTData[0].fields, id: aTData[0].id});
      }

      await quizBase
        .select({
          maxRecords: 1200,
          view: "Grid view",
          filterByFormula: `({isActive} = 'yes')`,
        })
        .eachPage(
          function page(records, fetchNextPage) {
            records.forEach(function (record) {
              finalData.push(record);
            });

            fetchNextPage();
          },
          function done(err) {
            setQuizDetails(
              finalData.map((val) => ({...val.fields, id: val.id}))
            );

            if (err) {
              console.error(err);
              return;
            }
          }
        );
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const getUserDetails = async () => {
    setDisplayLoader(true);
    const user = JSON.parse(localStorage.getItem("user"));
    const aTData = await userBase
      .select({
        view: "Grid view",
        filterByFormula: `({its_id} = '${user.ITS_ID}')`,
      })
      .firstPage();
    if (!aTData.length) {
      setDisplayLoader(false);
      message.info("quiz session has ended");
      handleLogout();
    } else {
      setUserDetails({...aTData[0].fields, id: aTData[0].id});
      setDisplayLoader(false);
    }
  };
  const getQuizDetails = async () => {
    const finalData = [];
    setDisplayLoader(true);
    await quizBase
      .select({
        maxRecords: 1200,
        view: "Grid view",
        filterByFormula: `({isActive} = 'yes')`,
      })
      .eachPage(
        function page(records, fetchNextPage) {
          records.forEach(function (record) {
            finalData.push(record);
          });

          fetchNextPage();
        },
        function done(err) {
          setQuizDetails(finalData.map((val) => ({...val.fields, id: val.id})));
          setDisplayLoader(false);

          if (err) {
            console.error(err);
            return;
          }
        }
      );
  };

  const handleLogout = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      localStorage.clear();
      router.push("/");
    }
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
                {userDetails && userDetails.name ? userDetails.name : ""}
              </p>
            </div>
          </Col>
          <Col xs={16}>
            <div className="flex flex-col">
              <span>Mohallah:</span>
              <div>
                {userDetails && userDetails.sector ? (
                  <Tag
                    className="text-lg"
                    color={getSectorColor(userDetails.sector)}
                  >
                    {userDetails.sector}
                  </Tag>
                ) : null}
              </div>
            </div>
          </Col>
          {quizDetails.length > 0 ? (
            <Col xs={8}>
              <div className="flex flex-col">
                <span>Score:</span>
                <p className="text-3xl font-medium">
                  {userDetails && userDetails.score
                    ? userDetails.score + " / 5"
                    : "0 / 5"}
                </p>
              </div>
            </Col>
          ) : null}
        </Row>
        <div className="w-full flex flex-col">
          {quizDetails.length > 0 ? (
            quizDetails.map((val, index) => {
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
                  userTableReference={userBase}
                  userDetails={userDetails}
                  getUserDetails={getUserDetails}
                  getQuizDetails={getQuizDetails}
                  title={title}
                  {...val}
                  key={val.id}
                />
              );
            })
          ) : (
            <Result status="404" title="Quiz will begin shortly!" />
          )}
        </div>
      </Content>
    </Layout>
  );
};

export default QuizPage;
