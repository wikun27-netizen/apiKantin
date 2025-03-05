export const  APIResponse = (ok, message, data) => {
  return {
    ok: ok,
    message: message,
    data: data
  }
};
export const throwErr = (err) => {
  const message = err.message;
  const stack = err.stack;
  if (message.includes('relog!!!')) {
    console.error(message);
    return APIResponse(false, message.replace('relog!!!', '!!!'), {
      'Command': 'relogin'
    });
  }
  if (message.includes('!!!')) {
    console.error(message);
    return APIResponse(false, message);
  }
  console.error(message + '\n' + stack);
  return APIResponse(false, message, stack);
};