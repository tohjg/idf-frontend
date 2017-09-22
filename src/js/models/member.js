class Member {
  constructor(name, email) {
    this.name = name
    this.email = email
  }
}

/**
 * convert Object-based array to Member-based array
 */
Member.fromArray = (array) => {
  if (array == undefined) return [];

  return array.reduce((acc, {name, email}) => {
    acc.push(new Member(name, email))
    return acc;
  }, [])
}

export default Member
