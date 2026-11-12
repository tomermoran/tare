# Test doubles for the database and the session

Data access and action tests run as a signed-in household without cookies or
Firebase. In the test file:

```ts
vi.mock("@/db/client", () => import("@/test/mocks/db"));
vi.mock("@/server/auth/session", () => import("@/test/mocks/session"));

beforeEach(async () => {
  testContext.db = await createTestDb();
  const { user } = await makeHousehold(testContext.db);
  signInAs(user.firebaseUid);
});
```
