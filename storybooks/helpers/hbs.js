const moment = require('moment');

//These are helper functions, try to search for them in the project to see where they are used.

module.exports = {
    formatDate: function(date,format){
        return moment(date).format(format);
    },
    
    truncate: function (str,len){
        if(str.length > len && str.length > 0){
            let new_str = str + ' ';
            new_str = str.substr(0,len);
            new_str = str.substr(0,new_str.lastIndexOf(' '));
            new_str = new_str.length > 0 ? new_str : str.substr(0,len);
            return new_str + '...'
        }
        return str;
    },

    stripTags: function (input){
        return input.replace(/<(?:.|\n)*?>/gm,'');
    },

    editIcon: function (storyUser, loggedUser, storyId, floating = true)
    {
        if(storyUser._id.toString() == loggedUser._id.toString()){
            if(floating){
                return `<a href="/stories/edit/${storyId}" class="btn-floating
                halfway-fab blue"><i class="fas fa-edit fa-small"></i></a>`
            }else{
                return `<a href="/stories/edit/${storyId}"><i class="fas fa-edit"></i></a>`
            }
        }else{
            return '';
        }
    },
    select: function(selected, options){    //Used for dropdown element when you edit a story. The value of the dropdown has to match
        return options                      //It is used in edit.hbs as #select
            .fn(this)
            .replace(
                new RegExp(' value="' + selected + '"'),
                '$& selected="selected"'
            )
            .replace(
                new RegExp('>' + selected + '</option>'),
                ' selected="selected"$&'
            )
    },
}