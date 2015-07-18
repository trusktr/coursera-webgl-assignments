
FlowRouter.route('/', {
    action: function(params) {
        Session.set('title', 'Home')
        Session.set('contentTemplate', 'home')
    }
})

FlowRouter.route('/:hwk', {
    action: function(params) {
        let assignmentNumber = params.hwk.match(/\d+/g)[0]
        Session.set('title', 'Assignment ' + assignmentNumber)
        Session.set('contentTemplate', params.hwk)
    }
})
