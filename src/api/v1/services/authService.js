const { publishEvent } = require('../../../rabbitmq/rabbitmqPublisher');
//
const bcrypt = require('bcrypt'); // hashing

const { Account, validateAccount } = require("../models/accountModel");
const { isValidId, validateAuthReqBody } = require("../validations/validators");

// For testing
exports.test_1 = async (req) => {
  
};

// Profile
exports.authAccount = async (req) => {
  try {
    // 1. validate req.body
    const { error } = validateAuthReqBody(req.body);
    if (error) {
      const validationError = new Error(JSON.stringify(error.details));
      validationError.statusCode = 400;
      throw validationError;
    } 
    // 2. verify email
    const account = await Account.findOne({ email: req.body.email });
    if (!account) {
      const err = new Error("Invalid email or password");
      err.statusCode = 401;
      throw err;
    }
    // 3. verify password
    const validPassword = await bcrypt.compare(req.body.password, account.password);
    if (!validPassword) {
      const err = new Error("Invalid email or password");
      err.statusCode = 401;
      throw err;
    }
    const token = account.generateAuthToken();
    // return token;
    return {
      token,
      account: {
        _id: account._id,
        userId: account.userId,
        name: account.name,
        email: account.email,
        role: account.role
      }
    };
  } catch (err) {
    throw new Error(`Authentication failed! ${err.message}`);
  }
}

exports.getAllAccounts = async (req) => {
  return Account.find().sort("-name");
};



exports.getAccountByUserId = async (req) => {
  // verify valid id
  const { userId } = req.params;
  if (!isValidId(userId)) {
    const error = new Error("Invalid userId");
    error.statusCode = 500;
    throw error;
  }
  // find by id
  // const account = await Account.findById(AccountId).select("-password");
  const account = await Account.findOne({
    userId: userId
  })
  // not found id
  if (!account) {
    const error = new Error("Account not found");
    error.statusCode = 404;
    throw error;
  }
  return account;
};

// Called by User Service (password hashed already)
exports.createAccount = async (req) => { 
  // 1. validate req.body
  const { error } = validateAccount(req.body);
  if (error) throw new Error(JSON.stringify(error.details));
  try {
    // 2. check existing email
    let existingAccount = await Account.findOne({ email: req.body.email });
    if (existingAccount) {
      const duplicateError = new Error("This email already exists");
      duplicateError.statusCode = 400; // Conflict
      throw duplicateError;
    }
    // 3. check existing userId

    // 4. create the Account
    const newAccount = new Account({
      ...req.body
    });
    const savedAccount = await newAccount.save();
    const token = savedAccount.generateAuthToken();
    console.log('New account: ', savedAccount);
    return {
      token,
      account: {
        _id: savedAccount._id,
        userId: savedAccount.userId,
        name: savedAccount.name,
        email: savedAccount.email,
        role: savedAccount.role
      }
    };

  } catch (err) {
    throw new Error(`Failed to create account: ${err.message}`);
  }
};

// Called by Admin (no hashed password)
exports.createAccountByAdmin = async (req) => {
  // 1. validate req.body
  const user = req.body;
  console.log("user: ", user);
  user.createdBy = req.user.email;
  const { error } = validateAccount(user);
  if (error) throw new Error(JSON.stringify(error.details));
  try {
    // 2. check existing email
    let existingAccount = await Account.findOne({ email: user.email });
    if (existingAccount) {
      const duplicateError = new Error("This email already exists");
      duplicateError.statusCode = 400; // Conflict
      throw duplicateError;
    }
    // 3. check existing userId

    // 4. create the Account
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    const newAccount = new Account({
      ...user,
      password: hashedPassword
    });
    const savedAccount = await newAccount.save();
    const accountWithoutPassword = savedAccount.toObject();
    delete accountWithoutPassword.password;
    return accountWithoutPassword;
  } catch (err) {
    throw new Error(`Failed to create account: ${err.message}`);
  }
};

exports.getAccount = async (req) => {
  const { accountId } = req.params;
  // invalid id
  if (!isValidId(accountId)) {
    const error = new Error("Invalid AccountId");
    error.statusCode = 500;
    throw error;
  }
  // find by id
  const account = await Account.findById(accountId).select("-password");
  if (!account) {
    const error = new Error("Account not found");
    error.statusCode = 404;
    throw error;
  }

  return account;
};

//

exports.updateAccount = async (req) => {
  // update the Account
  try {
    const updateFields = {};
    if (req.body.name) updateFields.name = req.body.name;
    // (password hashed already)
    if (req.body.password) updateFields.password = req.body.password; 
    // Find Account by userId and update
    const userId = req.user._id;
    const account = await Account.findOneAndUpdate(
      { userId: userId },
      { $set: updateFields },
      { new: true }
    ).select('-password');
    if (!account) {
      const error = new Error("Account not found");
      error.statusCode = 404;
      throw error;
    }

    // const account = await Account.findByIdAndUpdate(
    //   req.account._id,
    //   { $set: updateFields },
    //   { new: true }
    // ).select('-password');
    
    return account;
  } catch (err) {
    throw new Error(`Failed to update Account: ${err.message}`);
  }
};

exports.deleteAccount = async (req) => {
  const { accountId } = req.params;
  // val AccountId
  if (!isValidId(accountId)) {
    const error = new Error("Invalid AccountId");
    error.statusCode = 500;
    throw error;
  }

  try {
    let result = await Account.findByIdAndDelete(accountId);
    // if (!res) return res.status(404).send("The Account id is invalid!");
    if (!result) {
      const error = new Error("Account not found");
      error.statusCode = 404;
      throw error;
    }
    return result;
  } catch (err) {
    throw new Error(`Failed to delete Account: ${err.message}`);
  }
};

// For internal implementation
exports.updateAccountInternal = async (account) => {
  // update the Account
  try {
    // const updateFields = {};
    // if (account.name) updateFields.name = account.name;
    // if (account.password) updateFields.password = account.password; 
    const userId = account.userId;
    
    const accountTmp = await Account.findOneAndUpdate(
      { userId: userId },
      { $set: account },
      { new: true }
    ).select('-password');
    if (!accountTmp) {
      const error = new Error("Account not found");
      error.statusCode = 404;
      throw error;
    }

    // const account = await Account.findByIdAndUpdate(
    //   req.account._id,
    //   { $set: updateFields },
    //   { new: true }
    // ).select('-password');
    
    return accountTmp;
  } catch (err) {
    throw new Error(`Failed to update Account: ${err.message}`);
  }
};

exports.delAccountByUserIdInternal = async (userId) => {
  try {
  // verify valid id
  if (!isValidId(userId)) {
    const error = new Error("Invalid userId");
    error.statusCode = 500;
    throw error;
  }
  // find and delete
  const result = await Account.findOneAndDelete({ userId: userId });
  if (!result) {
    const error = new Error("Account not found");
    error.statusCode = 404;
    throw error;
  }
  return result;
  } catch (err) {
    throw new Error(`Failed to update Account: ${err.message}`);
  }
};



