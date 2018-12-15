require 'rails_helper'

RSpec.describe Api::V1::UsersController, type: :controller do
  before(:each) { request.headers['Accept'] = "application/demo.com.v1" }
  
  describe "GET #show" do
    before(:each) do
      @user = create(:user)
      get :show,  params: { id: @user.id, format: :json }
    end
    
    it "returns the information about a reporter on a hash" do
      user_response = JSON.parse(response.body, symbolize_names: true)
      expect(user_response[:email]).to eql @user.email
    end
    
    it { should respond_with 200 }
  end

  describe "POST #create" do
    context "when is succesfully created" do
      before(:each) do
        @user_attributes = attributes_for(:user)
        # second argument to `post` must be a value to `params` hash to pass the tests
        post :create, params: { user: @user_attributes }, format: :json
      end
    
      it "renders the json representation for the user record just created" do
        user_response = JSON.parse(response.body, symbolize_names: true)
        expect(user_response[:email]).to eql @user_attributes[:email]
      end
    
      it { should respond_with 201 }
    end
  
    context "when is not created" do
      before(:each) do
        @invalid_user_attributes = {password: "12345678", password_confirmation: "12345678" }
        # second argument to `post` must be a value to `params` hash to pass the tests
        post :create, params: { user: @invalid_user_attributes }, format: :json
      end
    
      it "renders an errors json" do
        user_response = JSON.parse(response.body, symbolize_names: true)
        expect(user_response).to have_key(:errors)
      end
    
      it "renders the json errors on why the user could not be created" do
        user_response = JSON.parse(response.body, symbolize_names: true)
        expect(user_response[:errors][:email]).to include "can't be blank"
      end
    
      it { should respond_with 422 }
    end
  end
end
