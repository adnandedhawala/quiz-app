import {Card} from "antd";
import {useState, useEffect} from "react";
import {firestore} from "../firebase/firebaseConfig";
import {collection, getDocs} from "firebase/firestore";
import {CSVLink} from "react-csv";

export const QuizUsersCard = () => {
  const [quizUsers, setQuizUsers] = useState([]);

  useEffect(() => {
    getQuizUsers();
  }, []);

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

  return (
    <Card className="border-radius-10" title="Quiz Users">
      <div className="flex items-center justify-center mb-4">
        <span className="flex-1">Number of Users</span>
        <span className="text-2xl">{quizUsers.length}</span>
      </div>
      <div className="flex items-center justify-center mb-4">
        <span className="flex-1">Download User data </span>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-0 px-4 border border-blue-700 rounded h-10 flex items-center justify-center">
          <CSVLink data={quizUsers}>Download me</CSVLink>
        </button>
      </div>
    </Card>
  );
};
