#!/bin/sh
# Install mongodb
brew tap mongodb/brew
brew install mongodb-community@4.0
# Start server
sudo mongod
nodemon
