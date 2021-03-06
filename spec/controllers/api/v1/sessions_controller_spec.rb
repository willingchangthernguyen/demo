require 'rails_helper'

RSpec.describe Api::V1::SessionsController, type: :controller do
  describe 'POST #create' do
    before(:each) do
      @user = create(:user)
    end
    context 'when the credentials are correct' do
      before(:each) do
        credentials = { email: @user.email, password: '1234567a' }
        post :create, params: { session: credentials }
      end
      it 'returns the user record corresponding to the given credentials' do
        @user.reload
        expect(json_response[:first_name]).to eql @user.first_name
        expect(json_response[:surname]).to eql @user.surname
      end
      it { should respond_with 200 }
    end

    context 'when the credentials are incorrect' do
      before(:each) do
        credentials = { email: @user.email, password: 'invalidpassword' }
        post :create, params: { session: credentials }
      end
      it 'returns a json with an error' do
        expect(json_response[:error]).to eql 'Invalid email or password'
      end
      it { should respond_with 422 }
    end
  end

  describe 'DELETE #destroy' do
    before(:each) do
      @user = create :user
      sign_in @user
      delete :destroy, params: { id: @user.auth_token }
    end
    it { should respond_with 204 }
  end
end
