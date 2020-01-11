FROM node:12.14

#USER node
WORKDIR /srv

COPY . .

# EXPOSE 3000
# RUN npm install && npx sequelize-cli db:migrate && npx sequelize-cli db:seed:all
RUN npx sequelize-cli db:migrate && npx sequelize-cli db:seed:all
CMD ["node", "app.js"]