class Api::V1::UsersController < ApplicationController
    def index
        @users = User.all 
        render json: @users, only: [:id, :name]
    end
    
    def new
    
    end
    
    def create
    
    end
    
    def edit
    
    end
    
    def update
    
    end
    
    def show
    
    end
    
    def destroy
    
    end
end
