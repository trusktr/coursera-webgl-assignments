Tracker.autorun(()=>{
    document.title = `${Session.get('title')} - Joe Pea`
})

Template.content.helpers({
    contentTemplate: () => Session.get('contentTemplate')
})
