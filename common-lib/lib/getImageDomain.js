export const getImageDomain = async () => {
  const data = new Promise((resolve, reject) => {
    fetch("https://gapi.cypghg.com/api/domain/image_domain", {
      method: "GET",
      headers: new Headers({
        token:
          "d2777be739f7674d1299bdafa8050f36d1c0cfd3904e241d6a756c08c5b6bfdf",
      }),
    })
      .then((data) => {
        return data.json();
      })
      .then((result) => {
        resolve(result.result);
      });
  });
  return data;
};
