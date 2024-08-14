const onLogout = () => {
  sessionStorage.clear();
  localStorage.clear();
  window.location.href = window.location.origin;
};

export default onLogout;
