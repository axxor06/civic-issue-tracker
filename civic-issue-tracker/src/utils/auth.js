
export const saveLoggedUser = (user) => {
  const loggedUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  }

  localStorage.setItem('loggedUser', JSON.stringify(loggedUser))
}

export const getLoggedUser = () => {
  const user = localStorage.getItem('loggedUser')

  return user ? JSON.parse(user) : null
}

export const logoutUser = () => {
  localStorage.removeItem('loggedUser')
}
