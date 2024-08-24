# BACKEND NODEJS PROJECT

## Installed request

- **Nodejs**: v18.18.0
- **Mysql**: 8.0 (use docker-compose)

## Development environment (environments)

- **LCL**: Local environment

The configuration files with the respective environments are located in the directory `env`.
Commands that do not specify which environment will **default is `LCL`**

## Install the project and run the server

- **Step 1:** Clone git repository to your computer:
  `git clone`
- **Step 2:** Install packages:
  `yarn`
- **Step 3:** In the **env** directory:

  - Copy file `LCL.env.example`
  - Rename to `LCL.env`

    Pay attention to change the connection database parameters in local, ...

- **Step 4:** Start server
  - Run in normal mode: `yarn start`
  - Run in update tracking mode: `yarn watch`

- **API:** List API
  - Register: [POST] /user/auth/sign-up
  - Login: [POST] /user/auth/sign-in
  - Profile: [GET] /user/users/user-information
  - Refresh token: [PUT] /user/auth/refresh-token