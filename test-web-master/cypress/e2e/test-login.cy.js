describe("Login Test", () => {
  const loginCredentials = [
    { username: "adminkamonchanok", password: "PassWord1234567!", expectedErrors: [] },
    { username: "KAMONCHANOK", password: "PassWord1234567!", expectedErrors: ["Username must start with a lowercase letter."] },
    { username: "AdminKamonchanok", password: "PassWord1234567!", expectedErrors: ["Username must start with a lowercase letter."] },
    { username: "adminkamonchanok1234567", password: "PassWord1234567!", expectedErrors: [] },
    { username: "ADMINKAMONCHANOK1234567", password: "PassWord1234567!", expectedErrors: ["Username must start with a lowercase letter."] },
    { username: "@adminkamonchanok1234567", password: "PassWord1234567!", expectedErrors: ["Username must start with a lowercase letter."] },
    { username: "@ADMINKAMONCHANOK1234567", password: "PassWord1234567!", expectedErrors: ["Username must start with a lowercase letter."] },
    { username: "@ADMINKAMONCHANOK", password: "PassWord1234567!", expectedErrors: ["Username must start with a lowercase letter."] },
    { username: "@adminkamonchanok", password: "PassWord1234567!", expectedErrors: ["Username must start with a lowercase letter."] },
    { username: "adminkam", password: "PassWord1234567!", expectedErrors: ["Username must be 10-24 characters long."] },
    { username: "adminkamonchanokzazazazaza", password: "PassWord1234567!", expectedErrors: ["Username must be 10-24 characters long."] },
    { username: "", password: "PassWord1234567!", expectedErrors: ["Please fill out all fields."] },
    { username: "adminKamonchanok", password: "PassWord1234567!", expectedErrors: [] },
    { username: "adminkamonchanok", password: "password1234567!", expectedErrors: ["Password must include at least one uppercase letter."] },
    { username: "adminkamonchanok", password: "PASSWORD1234567!", expectedErrors: ["Password must include at least one lowercase letter."] },
    { username: "adminkamonchanok", password: "PassWord1234567", expectedErrors: ["Password must include at least one special character."] },
    { username: "adminkamonchanok", password: "PassWord_!!!!!!!", expectedErrors: ["Password must include at least one number."] },
    { username: "adminkamonchanok", password: "PassWord123456!", expectedErrors: ["Password must be 16-32 characters long."] },
    { username: "adminkamonchanok", password: "PassWord_1234567@PassWord_1234567", expectedErrors: ["Password must be 16-32 characters long."] },
    { username: "adminkamonchanok", password: "", expectedErrors: ["Please fill out all fields."] },
    { username: "ปานlnwzaaaaaaa007", password: "PassWord1234567!", expectedErrors: ["Username must start with a lowercase letter."] },
    { username: "adminkamonchanok", password: "พาสเวิร์ดจ้าาาาาาา", expectedErrors: ["Password must include at least one lowercase letter."] },
    { username: "1adminkamonchanok", password: "PassWord1234567!", expectedErrors: ["Username must start with a lowercase letter."] },
    { username: "กมลชนกพุกกี้นะจ๊ะจุ๊ปๆ", password: "PassWord1234567!", expectedErrors: ["Username must start with a lowercase letter."] },
    { username: "adminkamonchanok", password: "PassWord_1234567กมลชนก", expectedErrors: ["Password must include at least one special character."] },
  ];

  loginCredentials.forEach((credential) => {
    it(`Test Login: ${credential.username}`, () => {
      cy.visit("https://test-web-login.vercel.app/");
  
      // กรอกข้อมูล username
      if (credential.username === "") {
        cy.get("#username").clear(); // เคลียร์ฟิลด์ username
      } else {
        cy.get("#username").clear().type(credential.username); // กรอก username
      }
  
      // กรอกข้อมูล password
      if (credential.password === "") {
        cy.get("#password").clear(); // เคลียร์ฟิลด์ password
      } else {
        cy.get("#password").clear().type(credential.password); // กรอก password
      }
  
      cy.get("#button-login").click();
  
      if (credential.expectedErrors.length > 0) {
        // ตรวจสอบข้อความผิดพลาด
        cy.get(".bg-red-100", { timeout: 10000 }).should("exist");
        credential.expectedErrors.forEach((error) => {
          cy.contains(error, { timeout: 10000 }).should("exist");
        });
      } else {
        // ตรวจสอบว่าเปลี่ยนไปยังหน้าหลักของ Shopee
        cy.origin("https://shopee.co.th", () => {
          cy.location("href", { timeout: 10000 }).then((url) => {
            cy.log("Actual URL:", url);
            expect(url).to.include("/lg_officialstore?is_from_login=true");
          });
          cy.get("body").should("exist");
          cy.log("✅ Login Success");
        });
      }
    });
  });

  it("Test Forget Password", () => {
    cy.visit("https://test-web-login.vercel.app/");

    cy.get("#username").should("exist");
    cy.get("#password").should("exist");

    cy.get("#button-forget-password").click();

    // ใช้ cy.origin() เพื่อรันคำสั่งบนโดเมน shopee.co.th
    cy.origin("https://shopee.co.th", () => {
      // ตรวจสอบว่าเปลี่ยนไปยังหน้า Forget Password
      cy.url().should("include", "/buyer/reset");

      // ตรวจสอบ element บนหน้า Forget Password
      cy.get("body").should("exist");
      cy.log("✅ Forget Password Success");
    });
  });
});