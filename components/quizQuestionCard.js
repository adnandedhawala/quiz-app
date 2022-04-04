import {Card, message, Radio, Space, Tag} from "antd";
import {useState, useEffect} from "react";

export const QuizQuestionCard = (props) => {
  const [radioValue, setRadioValue] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    title,
    id,
    getUserDetails,
    getQuizDetails,
    correct_option,
    userDetails,
    question_id,
    option1,
    option2,
    option3,
    option4,
    english_option1,
    english_option2,
    english_option3,
    english_option4,
    isQuizTimeOver,
    userTableReference,
  } = props;
  useEffect(() => {
    if (userDetails[question_id + "_answer"]) {
      setRadioValue(userDetails[question_id + "_answer"]);
    }
  }, [userDetails]);

  const handleRadioValueChange = (e) => {
    if (!userDetails[question_id + "_answer"] && isQuizTimeOver === "no") {
      setRadioValue(e.target.value);
    }
  };

  const handleSubmitanswer = async () => {
    setIsSubmitting(true);
    if (isQuizTimeOver === "yes") {
      message.error("Quiz timeout!");
    } else {
      const initialScore = userDetails.score || 0;
      const newScore =
        radioValue === correct_option ? initialScore + 1 : initialScore;
      await userTableReference.update([
        {
          id: userDetails.id,
          fields: {
            [question_id + "_answer"]: radioValue,
            score: newScore,
          },
        },
      ]);
    }
    setIsSubmitting(false);
    await getUserDetails();
    await getQuizDetails();
  };

  return (
    <Card title={title} key={id} className="rounded-lg mb-2">
      <div className="mb-8">
        <Radio.Group
          // disabled={userDetails[question_id + "_answer"]}
          value={radioValue}
          onChange={handleRadioValueChange}
          name="radiogroup"
        >
          <Space size="large" direction="vertical">
            <Radio value="option1">
              <div>
                <p className="mb-2 text-xl font-arabic">{option1}</p>
                <p className="text-lg">{english_option1}</p>
                {isQuizTimeOver === "yes" && correct_option === "option1" ? (
                  <Tag
                    color="success"
                    className="text-lg rounded-full mt-2 py-1 px-3"
                  >
                    Correct Answer
                  </Tag>
                ) : null}
              </div>
            </Radio>
            <Radio value="option2">
              <div>
                <p className="mb-2 text-xl font-arabic">{option2}</p>
                <p className="text-lg">{english_option2}</p>
                {isQuizTimeOver === "yes" && correct_option === "option2" ? (
                  <Tag
                    color="success"
                    className="text-lg rounded-full mt-2 py-1 px-3"
                  >
                    Correct Answer
                  </Tag>
                ) : null}
              </div>
            </Radio>
            <Radio value="option3">
              <div>
                <p className="mb-2 text-xl font-arabic">{option3}</p>
                <p className="text-lg">{english_option3}</p>
                {isQuizTimeOver === "yes" && correct_option === "option3" ? (
                  <Tag
                    color="success"
                    className="text-lg rounded-full mt-2 py-1 px-3"
                  >
                    Correct Answer
                  </Tag>
                ) : null}
              </div>
            </Radio>
            <Radio value="option4">
              <div>
                <p className="mb-2 text-xl font-arabic">{option4}</p>
                <p className="text-lg">{english_option4}</p>
                {isQuizTimeOver === "yes" && correct_option === "option4" ? (
                  <Tag
                    color="success"
                    className="text-lg rounded-full mt-2 py-1 px-3"
                  >
                    Correct Answer
                  </Tag>
                ) : null}
              </div>
            </Radio>
          </Space>
        </Radio.Group>
      </div>
      {!userDetails[question_id + "_answer"] && isQuizTimeOver === "no" ? (
        <button
          disabled={!radioValue || isSubmitting}
          onClick={handleSubmitanswer}
          className="bg-blue-500 hover:bg-blue-700 disabled:bg-gray-200 disabled:border-gray-200 text-white font-bold py-0 px-4 border border-blue-700 rounded h-10 flex items-center justify-center"
        >
          <span>Submit Answer</span>
        </button>
      ) : null}
    </Card>
  );
};
