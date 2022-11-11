import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import { Typography } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import TextField from "@mui/material/TextField";
import { handleDrawerToggle } from "../../reducers/responsive";
import { useSelector, useDispatch } from "react-redux";
import { RefreshRounded } from "@mui/icons-material";
import { RootState } from "../../store";
import CategoryIcon from "@mui/icons-material/Category";
import Button from "@mui/material/Button";
import { Subject, debounceTime } from "rxjs";
import { fetchNoToken } from "../../services/fetch/fetch";
import { CategoryType } from "../../interfaces/categories/category";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { setCategories } from "../../reducers/categories";
import { setCategory } from "../../reducers/category";
import { setQuestions } from "../../reducers/question";
import { QuestionType } from "../../interfaces/questions/question";
import Paginated from "../../interfaces/paginated";

export const Sidebar = (props: {
  drawerWidth: number;
  window?: () => Window;
}) => {
  const [isFiltering, setIsFiltering] = useState(false);
  const [onSearch$] = useState(() => new Subject());
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [newCategory, setNewCategory] = useState("");
  const { window } = props;
  const mobileOpen = useSelector(
    (state: RootState) => state.responsive.sidebar
  );
  const categories = useSelector((state: RootState) => state.categories);
  const questions = useSelector((state: RootState) => state.questions);
  const dispatch = useDispatch();

  const container =
    window !== undefined ? () => window().document.body : undefined;

  const filterCategory = async (name: string) => {
    if (name.length === 0) {
      return getCategories();
    }
    const data: Paginated<CategoryType> = await fetchNoToken(
      `category?name=${name}&size=2&page=1`,
      "GET"
    );
    dispatch(setCategories(data));
  };

  const addCategory = async () => {
    setIsFiltering(true);
    const res = await fetchNoToken("category", "POST", { name: newCategory });
    if (res) {
      getCategories();
      setNewCategory("");
    }
    setIsFiltering(false);
  };

  const getCategories = async () => {
    const data: Paginated<CategoryType> = await fetchNoToken(
      "category?size=10&page=1",
      "GET"
    );
    dispatch(setCategories(data));
  };

  const getQuestions = async (
    category: { id: number; name: string },
    id: number
  ) => {
    const questions: Paginated<QuestionType> = await fetchNoToken(
      `question?categoryId=${id}&page=1&size=10`,
      "GET"
    );
    dispatch(setCategory(category));
    setSelectedIndex(id);
    dispatch(setQuestions({ questions: 0, ...questions }));
  };

  useEffect(() => {
    onSearch$
      .pipe(debounceTime(400))
      .subscribe((a) => filterCategory(a as string));
  }, [onSearch$]);

  useEffect(() => {
    (async () => {
      const data: Paginated<CategoryType> = await fetchNoToken(
        "category?size=10&page=1",
        "GET"
      );
      if (data) {
        setSelectedIndex(data.results[0].id);
        dispatch(setCategory(data.results[0]));
        dispatch(setCategories(data));
        getQuestions(data.results[0], data.results[0].id);
      }
    })();
  }, []);

  const drawer = (
    <div>
      <Divider />
      <Typography variant="h4" align="center" gap={1} p={1}>
        Categories
      </Typography>
      <Box display="flex" gap={1} p={1}>
        <TextField
          id="outlined"
          size="small"
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          label="Add Category"
          variant="outlined"
        />
        <Button
          disabled={newCategory.length === 0}
          onClick={() => addCategory()}
          variant="contained"
          color="primary"
          size="small"
        >
          {isFiltering ? <RefreshRounded /> : "Send"}
        </Button>
      </Box>
      <Box p={1}>
        <TextField
          fullWidth
          type="text"
          onChange={(e) => onSearch$.next(e.target.value)}
          id="outlined"
          size="small"
          label="Find Category"
          variant="outlined"
        >
          <SearchOutlinedIcon />
        </TextField>
      </Box>
      <List>
        {categories.results.length > 0 &&
          categories.results.map(({ id, name }, index) => (
            <ListItem key={id} disablePadding>
              <ListItemButton selected={selectedIndex === id}>
                <ListItemIcon>
                  {index % 2 === 0 ? <CategoryIcon /> : <CategoryIcon />}
                </ListItemIcon>
                <ListItemText
                  onClick={() => getQuestions({ id, name }, id)}
                  primary={name}
                />
                {selectedIndex === id && <strong>{questions.questions}</strong>}
              </ListItemButton>
            </ListItem>
          ))}
      </List>
    </div>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: props.drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label="mailbox folders"
    >
      <Drawer
        container={container}
        variant="temporary"
        open={mobileOpen}
        onClose={() => dispatch(handleDrawerToggle(!mobileOpen))}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: props.drawerWidth,
          },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: props.drawerWidth,
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};
