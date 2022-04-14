import {Card, Form, Radio, Space, Tag} from "antd";

export const QuizQuestionCard = (props) => {
  const {
    title,
    correct_option,
    question_id,
    option1,
    option2,
    option3,
    option4,
    english_option1,
    english_option2,
    english_option3,
    english_option4,
    isQuizSubmitted,
    selectedValue,
    showAnswer,
  } = props;

  return (
    <Card title={title} key={question_id} className="rounded-lg mb-2">
      {isQuizSubmitted || showAnswer ? (
        <Radio.Group value={selectedValue}>
          <Space size="large" direction="vertical">
            <Radio value="option1">
              <div>
                <p className="mb-2 text-xl font-arabic">{option1}</p>
                <p className="text-lg">{english_option1}</p>
                {showAnswer && correct_option === "option1" ? (
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
                {showAnswer && correct_option === "option2" ? (
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
                {showAnswer && correct_option === "option3" ? (
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
                {showAnswer && correct_option === "option4" ? (
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
      ) : (
        <Form.Item className="mb-0" name={question_id + "_answer"}>
          <Radio.Group>
            <Space size="large" direction="vertical">
              <Radio value="option1">
                <div>
                  <p className="mb-2 text-xl font-arabic">{option1}</p>
                  <p className="text-lg">{english_option1}</p>
                </div>
              </Radio>
              <Radio value="option2">
                <div>
                  <p className="mb-2 text-xl font-arabic">{option2}</p>
                  <p className="text-lg">{english_option2}</p>
                </div>
              </Radio>
              <Radio value="option3">
                <div>
                  <p className="mb-2 text-xl font-arabic">{option3}</p>
                  <p className="text-lg">{english_option3}</p>
                </div>
              </Radio>
              <Radio value="option4">
                <div>
                  <p className="mb-2 text-xl font-arabic">{option4}</p>
                  <p className="text-lg">{english_option4}</p>
                </div>
              </Radio>
            </Space>
          </Radio.Group>
        </Form.Item>
      )}
    </Card>
  );
};
