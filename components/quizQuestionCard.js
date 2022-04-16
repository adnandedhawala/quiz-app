import {Card, Form, Radio, Space, Tag} from "antd";

export const QuizQuestionCard = (props) => {
  const {
    title,
    correct_option,
    question_id,
    isQuizSubmitted,
    selectedValue,
    showAnswer,
  } = props;

  const optionArr = ["option1", "option2", "option3", "option4"];

  return (
    <Card title={title} key={question_id} className="rounded-lg mb-2">
      {isQuizSubmitted || showAnswer ? (
        <Radio.Group value={selectedValue}>
          <Space size="large" direction="vertical">
            {optionArr.map((val, index) => {
              return (
                <Radio key={val + index} value={val}>
                  <div>
                    <p className="mb-2 text-xl font-arabic">{props[val]}</p>
                    <p className="text-lg">{props["english_" + val]}</p>
                    {showAnswer && correct_option === optionArr[index] ? (
                      <Tag
                        color="success"
                        className="text-lg rounded-full mt-2 py-1 px-3"
                      >
                        Correct Answer
                      </Tag>
                    ) : null}
                  </div>
                </Radio>
              );
            })}
          </Space>
        </Radio.Group>
      ) : (
        <Form.Item className="mb-0" name={question_id + "_answer"}>
          <Radio.Group>
            <Space size="large" direction="vertical">
              {optionArr.map((val, index) => {
                return (
                  <Radio key={index + val} value={val}>
                    <div>
                      <p className="mb-2 text-xl font-arabic">{props[val]}</p>
                      <p className="text-lg">{props["english_" + val]}</p>
                    </div>
                  </Radio>
                );
              })}
            </Space>
          </Radio.Group>
        </Form.Item>
      )}
    </Card>
  );
};
