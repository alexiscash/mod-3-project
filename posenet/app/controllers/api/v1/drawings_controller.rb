class Api::V1::DrawingsController < ApplicationController
    def index
        @drawers = Drawing.all 
        render json: @drawers, only: [:id, :name, :data, :user_id], include: [:user]
    end
    
    def new
    
    end
    
    def create
        # byebug
        @drawing = Drawing.create(prams)
        render json: @drawing
    end
    
    def edit
    
    end
    
    def update
    
    end
    
    def show
    
    end
    
    def destroy
    
    end

    private

    def prams
        params.require(:drawing).permit(:name, :data, :user_id, :xaverage, :yaverage)
    end
end
