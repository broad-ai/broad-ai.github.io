FROM node:20.4.0-alpine
WORKDIR /usr/app
COPY . .

# -- LLM keys --
# ENV CLAUDEAI_KEY=""
# ENV GOOGLEAI_KEY=""
# ENV OPENAI_KEY=""
# ENV OPENAI_ORG=""
# --

# -- Agent keys --
# ENV aviationstack=""
# ENV financialmodelingprep=""
# ENV google_search_engine=""
# ENV programmable_search_engine_id=""
# ENV yelp=""
# ENV openweathermap=""
# --

ENV PORT=8080
RUN npm install
EXPOSE 8080
CMD ["node", "index.js"]