import express from "express";
import helmet from "helmet";

const app = express();

app.use(helmet());

app.use(express.json());

interface IUserData {
  nome: string;
  email: string;
  password: string;
}

const users: IUserData[] = [];

app.post("/users", (req, res) => {
  const user = req.body;
  users.push(user);

  return res.status(201).json(user);
});

app.get("/users", (req, res) => {
  return res.status(200).json(users);
});

app.get("/users/:nameUser", (req, res) => {
  const nameUser = req.params.nameUser;

  const searchUser = users.find((user) => user.nome === nameUser && user);

  return res.status(200).json(searchUser);
});

app.put("/users/:nameUser", (req, res) => {
  const nameUser = req.params.nameUser;
  const user = req.body;

  users.forEach((u) => {
    if (u.nome === nameUser) {
      u = user;
    }
  });
  return res.status(200).json(user);
});

app.listen(3000, () => console.log("listening on port 3000"));
