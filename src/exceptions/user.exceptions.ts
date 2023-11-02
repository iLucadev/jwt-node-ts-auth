export class UserNotFoundException extends Error {
  constructor() {
    super("User not found");
    this.name = "UserNotFoundException";
  }
}

export class AccessTokenNotFoundException extends Error {
  constructor() {
    super("Access token not found");
    this.name = "AccessTokenNotFoundException";
  }
}

export class RefreshTokenNotFoundException extends Error {
  constructor() {
    super("Refresh token not found");
    this.name = "RefreshTokenNotFoundException";
  }
}

export class UserCreationFailedException extends Error {
  constructor() {
    super("Failed to create user");
    this.name = "UserCreationFailedException";
  }
}

export class InvalidCredentialsException extends Error {
  constructor() {
    super("Invalid login credentials");
    this.name = "InvalidCredentialsException";
  }
}

export class InvalidAccessTokenException extends Error {
  constructor() {
    super("Invalid access token");
    this.name = "InvalidAccessTokenException";
  }
}

export class InvalidRefreshTokenException extends Error {
  constructor() {
    super("Invalid refresh token");
    this.name = "InvalidRefreshTokenException";
  }
}
