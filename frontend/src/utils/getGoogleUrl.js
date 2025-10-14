function getGoogleUrl() {
  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  const options = {
    redirect_uri: process.env.REACT_APP_GOOGLE_OAUTH_REDIRECT_URL,
    client_id: process.env.REACT_APP_CLIENT_ID,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ].join(" "),
  };
  console.log(options);
  const queryStr = new URLSearchParams(options);
  console.log(queryStr.toString());

  return `${rootUrl}?${queryStr.toString()}`;
}

export default getGoogleUrl;
