class Member {
  constructor(
    name,
    email
  ) {}
}

Member.fromArray = (array) => {
  if (array == undefined) return [];

  return array.reduce((acc, value) => {
    acc.push(new Member(value.name, value.email))
    return acc;
  }, [])
}

export default Member
