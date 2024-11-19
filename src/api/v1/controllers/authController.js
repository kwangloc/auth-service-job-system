const authService = require('../services/authService');
const { publishEvent, formatNewUserMsg } = require('../../../rabbitmq/rabbitmqPublisher');

exports.test_1 = async (req, res, next) => {
  try {
    // const result = await authService.test_1(req);
    const result = await authService.delAccountByUserIdInternal(req.body.userId);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

// Auth
exports.authAccount = async (req, res, next) => {
  try {
    const result = await authService.authAccount(req);
    // Set token in header
    res.setHeader('Authorization', result.token);
    // Attach user's info in req body
    res.status(200).json({
      message: 'Authentication successful',
      account: result.account
    });
  } catch (err) {
    next(err);
  }
}

// Account
exports.getAllAccounts = async (req, res, next) => {
  try {
    const users = await authService.getAllAccounts(req);
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

exports.getAccount = async (req, res, next) => {
  try {
    const users = await authService.getAccount(req);
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

exports.getAccountByUserId = async (req, res, next) => {
  try {
    const users = await authService.getAccountByUserId(req);
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

exports.createAccount = async (req, res, next) => {
  try {
    // const account = await authService.createAccount(req);
    // // publish to RabbitMQ
    // if (account) {
    //   const newAccount = {
    //     accountId: account._id,
    //     email: account.email,
    //     password: account.password,
    //     name: account.name,
    //     role: 'candidate'
    //   };

    //   const routingKey = `${newAccount.role}.created`;
    //   await publishEvent(routingKey, newAccount);  
    // }
    // res.status(201).json(account);

    const result = await authService.createAccount(req);
    // Set token in header
    res.setHeader('authorization', result.token);
    // Attach user's info in req body
    res.status(200).json({
      message: 'Created account!',
      account: result.account
    });
  } catch (err) {
    next(err);
  }
};

exports.updateAccount = async (req, res, next) => {
  try {
    const user = await authService.updateAccount(req);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

exports.deleteAccount = async (req, res, next) => {
  try {
    const user = await authService.deleteAccount(req);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

// Admin
exports.createAccountByAdmin = async (req, res, next) => {
  try {
    const user = await authService.createAccountByAdmin(req);
    // console.log(typeof user);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

// exports.authAdmin = async (req, res, next) => {
//   try {
//     const result = await authService.authAdmin(req);
//     // Set token in header
//     res.setHeader('Authorization', `Bearer ${result.token}`);
//     // Send user info in body
//     res.status(200).json({
//       message: 'Authentication successful',
//       user: result.user
//     });
//   } catch (err) {
//     next(err);
//   }
// }