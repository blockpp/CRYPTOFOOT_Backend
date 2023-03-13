const CorporateUserRegistry = artifacts.require("CorporateUserRegistry");

contract("CorporateUserRegistry", accounts => {
  let adminContract;

  before(async () => {
    adminContract = await CorporateUserRegistry.new({ from: accounts[0] });
  });

  it("should add a user", async () => {
    const name = "Alice";
    const email = "alice@example.com";
    await adminContract.addUser(name, email, { from: accounts[1] });
    const user = await adminContract.getUser(accounts[1]);
    assert.equal(user.name, name, "Name should be Alice");
    assert.equal(user.email, email, "Email should be alice@example.com");
    assert.equal(user.validated, true, "User should be validated");
  });

  it("should delete a user", async () => {
    const name = "Alice";
    const email = "alice@example.com";
    await adminContract.addUser(name, email, { from: accounts[1] });
    await adminContract.deleteUser(accounts[1], { from: accounts[0] });
    const user = await adminContract.getUser(accounts[1]);
    assert.equal(user.name, "", "Name should be empty");
    assert.equal(user.email, "", "Email should be empty");
    assert.equal(user.validated, false, "User should not be validated");
  });

  it("should update a user's email", async () => {
    const name = "Alice";
    const email = "alice@example.com";
    await adminContract.addUser(name, email, { from: accounts[1] });
    const newEmail = "alice2@example.com";
    await adminContract.updateUserEmail(accounts[1], newEmail, { from: accounts[0] });
    const user = await adminContract.getUser(accounts[1]);
    assert.equal(user.email, newEmail, "Email should be alice2@example.com");
  });

  it("should update a user's validation status", async () => {
    const name = "Alice";
    const email = "alice@example.com";
    await adminContract.addUser(name, email, { from: accounts[1] });
    await adminContract.updateUserValidationStatus(accounts[1], false, { from: accounts[0] });
    const user = await adminContract.getUser(accounts[1]);
    assert.equal(user.validated, false, "User should not be validated");
  });

  it("should get the admin", async () => {
    const admin = await adminContract.getAdmin();
    assert.equal(admin.name, "", "Admin name should be empty");
    assert.equal(admin.email, "", "Admin email should be empty");
    assert.equal(admin.validated, true, "Admin should be validated");
  });
});