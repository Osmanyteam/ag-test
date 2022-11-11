import React from "react";
import Box from "@mui/material/Box";
import Accordion from "@mui/material/Accordion";
import Typography from "@mui/material/Typography";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import TextField from "@mui/material/TextField";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "@mui/material/Button";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import Container from "@mui/material/Container";
import { fetchNoToken } from "../../services/fetch/fetch";
import { setQuestion } from "../../reducers/question";
import { QuestionType } from "../../interfaces/questions/question";

export const Dashboard = ({ drawerWidth }: { drawerWidth: number }) => {
  const [expanded, setExpanded] = React.useState(0);
  const [newQuestion, setNewQuestion] = React.useState("");
  const [answer, setAnswer] = React.useState<{ content: string }[]>([]);
  const [newAnswer, setNewAnswer] = React.useState("");
  const questions = useSelector((state: RootState) => state.questions);
  const category = useSelector((state: RootState) => state.category);
  const dispatch = useDispatch();

  const addQuestion = async () => {
    const question: QuestionType = await fetchNoToken("question", "POST", {
      statement: newQuestion,
      categoryId: category.id,
    });
    setNewQuestion("");
    dispatch(setQuestion(question));
  };

  const handleChange =
    (panel: React.SetStateAction<number>) =>
    async (
      event: React.SyntheticEvent<Element, Event>,
      isExpanded: boolean
    ) => {
      setExpanded(isExpanded ? panel : 0);
      const res = await fetchNoToken(
        `answer?questionId=${panel}&page=1&size=2`,
        "GET"
      );
      setAnswer(res.results);
    };

  const addAnswer = async (id: number) => {
    await fetchNoToken("answer", "POST", {
      content: newAnswer,
      questionId: id,
    });
    const answerR = await fetchNoToken(
      `answer?questionId=${id}&page=1&size=2`,
      "GET"
    );
    setNewAnswer("");
    setAnswer(answerR.results);
  };


  return (
    <Container
      component="main"
      sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
    >
      <Typography>Topic: {category.name}</Typography>
      <Box display="flex" style={{ width: "100%" }} gap={1} p={1}>
        <TextField
          id="outlined"
          size="small"
          type="text"
          value={newQuestion}
          fullWidth
          onChange={(e) => setNewQuestion(e.target.value)}
          label="Add Question"
          variant="outlined"
        />
        <Button
          variant="contained"
          onClick={() => addQuestion()}
          color="primary"
          size="small"
        >
          Add
        </Button>
      </Box>
      {questions.results.length > 0 &&
        questions.results.map((i) => (
          <Accordion
            key={i.id}
            expanded={expanded === i.id}
            onChange={handleChange(i.id)}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <Typography sx={{ width: "33%", flexShrink: 0 }}>
                {i.statement} ?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box display="flex" style={{ width: "100%" }} gap={1} p={1}>
                <TextField
                  id="outlined"
                  size="small"
                  type="text"
                  value={newAnswer}
                  fullWidth
                  onChange={(e) => setNewAnswer(e.target.value)}
                  label="res question"
                  variant="outlined"
                />
                <Button
                  variant="contained"
                  onClick={() => addAnswer(i.id)}
                  color="primary"
                  size="small"
                >
                  Add
                </Button>
              </Box>

              <Typography>
                {answer.map((e, index) => (
                  <h5 key={index}>{e.content}</h5>
                ))}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
    </Container>
  );
};
