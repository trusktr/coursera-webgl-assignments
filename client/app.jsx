Tracker.autorun(()=>{
    document.title = `${Session.get('title')} - Joe Pea`
})

Template.body.helpers({
    contentTemplate: () => Session.get('contentTemplate')
})
