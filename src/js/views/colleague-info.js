import EventEmitter from '../utils/event-emitter.js'

export default class ColleagueInfo extends EventEmitter {
  constructor(info) {
    super()

    this.info = info
    this.populate()
  }

  populate() {
    const $tmpl = $('#colleague_template')
    const $container = $('.colleague-added')

    this.$self = $tmpl.clone()
    // and show up
    .removeClass('hide')

    // populate model data to view
    this.$self.find('#name').text(this.info.name)
    this.$self.find('#email').text(this.info.email)

    // add click listener to remove icon
    this.$self.find('.remove-colleague').click((e) => {
      // remove itself from the view
      // not matter if the colleague still exist in the list
      this.$self.remove()

      // dispatch event to widget to remove data from controller
      this.emit('removed')
    })

    // append to the dom
    $container.append(this.$self)
  }
}
