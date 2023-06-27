let macro={
    // Rounded iAction Buttion filled with Icon & Title
    riawt:(href,fontclass,title)=>{
        return `<a class="iaction rounded" href="${href}"><i class="${fontclass} hovertitled"><t>${title}</t></i></a>`;
    }
}

exports.Macro=macro;