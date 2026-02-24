let success = (result) => {
  return {
    status: 'success',
    result: result
  }
}

let error = (message) => {
  return {
    status: 'error',
    message: message
  }
}

module.exports = { success, error }