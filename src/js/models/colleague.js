
/**
 * model class for colleague
 */
class Colleague {
  constructor(name, email) {
    this.name = name
    this.email = email
  }
}

/**
 * convert Object-based array to Colleague-based array
 *
 * @param {array} array pure Object-based array
 */
Colleague.fromArray = (array) => {
  if (array == undefined) return [];

  return array.reduce((acc, {name, email}) => {
    acc.push(new Colleague(name, email))
    return acc;
  }, [])
}

export default Colleague
