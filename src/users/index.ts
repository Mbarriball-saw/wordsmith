const fs = require('fs');
const path = require('path');
import express = require('express');
const { v4: uuid } = require('uuid');

interface User {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  address: string;
  phoneNumber: string;
}

const app = express();
app.use(express.json());

const usersFilePath = path.join(__dirname, 'cache.json');

const getUsersFromFile = (): User[] => {
  // FIXME: handle empty/non-existant file
  return JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
};

const saveUsersToFile = (users: User[]): void => {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf8');
};

app.post('/create-user', (req: express.Request, res: express.Response): void => {
  const userId = uuid();
  const { firstName, lastName, age, address, phoneNumber } = req.body;
  const user: User = { id: userId, firstName, lastName, age, address, phoneNumber };
  const users = getUsersFromFile();
  users.push(user);
  saveUsersToFile(users);
  res.send({ userId });
});

app.get('/users', (_: any, res: express.Response): void => {
  const users = getUsersFromFile();
  res.send(users);
});

app.get('/users/:id', (req: express.Request, res: express.Response): void => {
  const { id } = req.params;
  const users = getUsersFromFile();
  const user = users.find((user) => user.phoneNumber === id);
  if (user) {
    res.send(user);
  } else {
    res.send(404);
  }
});

app.put('/users/:id', (req: express.Request, res: express.Response): void => {
  const { id } = req.params;
  const { firstName, lastName, age, address, phoneNumber } = req.body;
  const users = getUsersFromFile();
  const userIndex = users.findIndex((user) => user.id === id);
  if (userIndex !== -1) {
    const userToUpdate = users[userIndex];

    if (firstName) userToUpdate.firstName = firstName;
    if (lastName) userToUpdate.lastName = lastName;
    if (age) userToUpdate.age = age;
    if (address) userToUpdate.address = address;
    if (phoneNumber) userToUpdate.phoneNumber = phoneNumber;

    saveUsersToFile(users);
    res.send({ message: 'User updated successfully', user: users[userIndex] });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

app.delete('/users/:id', (req: express.Request, res: express.Response): void => {
  const { id } = req.params;
  const users = getUsersFromFile();
  const userIndex = users.findIndex((user) => user.id === id);
  if (userIndex !== -1) {
    const [deletedUser] = users.splice(userIndex, 1);
    saveUsersToFile(users);
    res.send({ message: 'User deleted successfully', user: deletedUser });
  } else {
    res.send(404);
  }
});

app.listen(3030, () => console.log(`Users API listening on port 3030`))
