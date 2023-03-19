import {Col, Layout, message, Row, Spin} from "antd";
import {collection, doc, getDoc, getDocs} from "firebase/firestore";
import Head from "next/head";
import Image from "next/image";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {PieChartCard} from "../../components/pieChartCard";
import {StatsCard} from "../../components/statsCard";
import {firestore} from "../../firebase/firebaseConfig";
import {getMohallahName, getSectorColor, mohallahList} from "../api/utils";

const {Header, Content} = Layout;

const AdminStats = () => {
  const router = useRouter();
  const [userDetails, setUserDetails] = useState({});
  const [quizUsers, setQuizUsers] = useState([]);
  const [displayLoader, setDisplayLoader] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.is_admin) {
      router.push("/");
    } else {
      getUserDetails(true);
      getQuizUsers();
    }
  }, []);

  useEffect(() => {
    const quizUsersId = setInterval(async () => {
      await getQuizUsers();
    }, 10000);

    return () => {
      clearInterval(quizUsersId);
    };
  }, []);

  const getUserDetails = async (showLoader) => {
    showLoader && setDisplayLoader(true);
    const user = JSON.parse(localStorage.getItem("user"));
    const docRef = doc(firestore, "quiz_user", String(user.its_id));
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      showLoader && setDisplayLoader(false);
      message.info("session timeout, please login again");
      handleLogout();
    } else {
      setUserDetails(docSnap.data());
      showLoader && setDisplayLoader(false);
    }
  };

  const getQuizUsers = async () => {
    const users = [];
    const querySnapshot = await getDocs(collection(firestore, "quiz_user"));
    querySnapshot.forEach((doc) => {
      users.push({
        ...doc.data(),
      });
      setQuizUsers(users);
    });
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
        <title>Qadr to Fatihah</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* <Header className="h-20 p-0 flex px-4 items-center fixed top-0 w-full z-10">
        <Image src="/logo.png" alt="logo" width={50} height={50} />
        <p className="whitespace-nowrap ml-2 text-lg text-white text-ellipsis overflow-hidden flex-grow">
          Qadr to Fatihah
        </p>
        <div>
          <button
            onClick={handleLogout}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-0 px-4 border border-blue-700 rounded h-10 flex items-center justify-center"
          >
            <span>Logout</span>
          </button>
        </div>
      </Header> */}
      {displayLoader ? (
        <div className="absolute z-50 top-0 left-0 w-screen h-screen bg-white/70 flex items-center justify-center">
          <Spin size="large" />
        </div>
      ) : null}
      <Content className="flex-grow min-h-screen overflow-y-auto px-4">
        <Row gutter={[24, 24]} className="mt-8">
          <Col xs={8}></Col>
          <Col xs={8}>
            <StatsCard
              label="Total Participants"
              size="large"
              count={quizUsers.length}
              color="#e0e0e0"
            />
          </Col>
          <Col xs={8}></Col>
          {Object.keys(mohallahList).map((val) => (
            <Col xs={4}>
              <StatsCard
                label={getMohallahName(val)}
                size="small"
                count={quizUsers.filter((user) => user.Sector === val).length}
                color={getSectorColor(val)}
              />
            </Col>
          ))}
          <Col xs={8}>
            <PieChartCard
              data={[
                quizUsers.filter((user) => user.Gender === "Male").length,
                quizUsers.filter((user) => user.Gender === "Female").length,
              ]}
              labels={["Male", "Female"]}
              backgroundColor={["#6ca0dc", "#f8b9d4"]}
              borderColor={["#6ca0dc", "#f8b9d4"]}
              title="Gender wise Participation"
            />
          </Col>
          <Col xs={8}>
            <PieChartCard
              title="Age wise Participation"
              data={[
                quizUsers.filter((user) => user.Age <= 20).length,
                quizUsers.filter((user) => user.Age > 20 && user.Age <= 35)
                  .length,
                quizUsers.filter((user) => user.Age > 35).length,
              ]}
              labels={["0-20", "21-35", "35+"]}
              backgroundColor={["#35d461", "#f9e104", "#882ff6"]}
              borderColor={["#35d461", "#f9e104", "#882ff6"]}
            />
          </Col>
          {/* <Col xs={8}>
            <PieChartCard
              title="Score Chart"
              data={[
                quizUsers.filter((user) => user.score === 0).length,
                quizUsers.filter((user) => user.score === 1).length,
                quizUsers.filter((user) => user.score === 2).length,
                quizUsers.filter((user) => user.score === 3).length,
                quizUsers.filter((user) => user.score === 4).length,
                quizUsers.filter((user) => user.score === 5).length,
              ]}
              labels={["0", "1", "2", "3", "4", "5"]}
              backgroundColor={[
                "#d4d4d4",
                "#35d461",
                "#f9e104",
                "#882ff6",
                "#6ca0dc",
                "#f8b9d4",
              ]}
              borderColor={[
                "#d4d4d4",
                "#35d461",
                "#f9e104",
                "#882ff6",
                "#6ca0dc",
                "#f8b9d4",
              ]}
            />
          </Col> */}
        </Row>
      </Content>
    </Layout>
  );
};

export default AdminStats;
