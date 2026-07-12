from pydantic import BaseModel

class LoginRequest(BaseModel):

    email: str
    password: str

class RegisterRequest(BaseModel):
    organization_name: str
    email: str
    password: str    

class ForgotPasswordRequest(BaseModel):
    email: str

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str
