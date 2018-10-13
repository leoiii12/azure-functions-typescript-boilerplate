# Azure Functions Typescript Boilerplate

## Packages
[typeorm](https://www.npmjs.com/package/typeorm), typescript ORM<br>
[bcrypt](https://www.npmjs.com/package/bcrypt), password encryption<br>
[jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken), JWT token authentication, X-Authorization

## Configs
`src/local.settings.json` for `AUTH_SECRET`<br>
`ormconfig.json`

## Development with VSCode

Wrap your function in
```javascript
context.res = await Function.run(
  context,
  async () => {
    const input = await transformAndValidate(YourInput, req.body) as YourInput;

    const connection = await DB.getConnection();
    const deviceRepository = connection.getRepository(Device);
  },
  Authorized.permit({
    anyRoles: [Role.Users, Role.Admins],
  }));
```
