const getDetails = () => {
 const searchParams = new URLSearchParams(window.location.search);
 console.log(searchParams);
 console.log(searchParams.get('appid'));
};