    function addTags() {
        var contentMarkdown = document.getElementById("markdownRadio").checked;
        text = document.getElementById("jsonText").value;
        // console.log(text);
        var obj = JSON.parse(text);

        // console.log(obj);

        var posts = obj.db[0].data.posts;
        var tags = obj.db[0].data.tags;
        var posts_tags = obj.db[0].data.posts_tags;
        var users = obj.db[0].data.users;

        var postsLookup = {};
        var tagsLookup = {};
        var usersLookup = {};

        for (i = 0; i < posts.length; i++) {
            postsLookup[posts[i].id] = posts[i];
            postsLookup[posts[i].id].tags = [];
        }

        for (i = 0; i < tags.length; i++) {
            tagsLookup[tags[i].id] = tags[i];
        }

        for (i = 0; i < users.length; i++) {
            usersLookup[users[i].id] = users[i];
        }

        // console.log(postsLookup);
        // console.log(tagsLookup);

        // console.log(posts_tags[0]);
        var postTagLength = posts_tags.length;
        for (i = 0; i < postTagLength; i++) {
            postID = posts_tags[i].post_id
            tagID = posts_tags[i].tag_id

            if (postsLookup[postID]) {
                postsLookup[postID].tags.push(tagsLookup[tagID])
            } else {
                // console.log('Skipping Tag ID ' + tagID + 'for Post ID' + postID);
            }

        }
        // console.log(postsLookup);
        var xmlString = '<?xml version="1.0" encoding="UTF-8" ?><rss version="2.0" xmlns:excerpt="http://wordpress.org/export/1.2/excerpt/" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:wfw="http://wellformedweb.org/CommentAPI/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:wp="http://wordpress.org/export/1.2/"><channel><wp:wxr_version>1.2</wp:wxr_version>';



        for (i = 0; i < users.length; i++) {
            xmlString += '<wp:author>'
            user = users[i];
            xmlString += '<wp:author_id>' + user.id + '</wp:author_id><wp:author_login>' + user.name + '</wp:author_login><wp:author_email>' + user.email + '</wp:author_email><wp:author_display_name><![CDATA[' + user.name + ']]></wp:author_display_name><wp:author_first_name><![CDATA[]]></wp:author_first_name><wp:author_last_name><![CDATA[]]></wp:author_last_name></wp:author>'
        }

        for (tag in tagsLookup) {

            // console.log(tag);
            xmlString += '<wp:tag><wp:term_id>' + tagsLookup[tag].id + '</wp:term_id><wp:tag_slug>' + tagsLookup[tag].slug + '</wp:tag_slug><wp:tag_name><![CDATA[' + tagsLookup[tag].name + ']]></wp:tag_name></wp:tag>\n'

        }

        for (postid in postsLookup) {
            // console.log(postid)
            var post = postsLookup[postid];
            // console.log(post);
            var postDate = new Date(post.published_at);
            xmlString += '<item><title>' + post.title + '</title><link>' + post.slug + '</link><pubDate>' + postDate.toUTCString() + '</pubDate><dc:creator><![CDATA[' + usersLookup[post.author_id].name + ']]></dc:creator><content:encoded><![CDATA[';
            if (contentMarkdown) {
                xmlString += post.markdown;
            } else {
                xmlString += post.html
            }
            xmlString += ']]></content:encoded>'

            if (post.custom_excerpt) {
                xmlString += '<excerpt:encoded><![CDATA[' + post.custom_excerpt + ']]></excerpt:encoded>'
            }

            xmlString += '<wp:post_name>' + post.slug + '</wp:post_name><wp:status>';

            if (post.status == 'published') {
                xmlString += 'publish</wp:status><wp:post_type>post</wp:post_type>';
            } else {
                xmlString += post.status + '</wp:status><wp:post_type>post</wp:post_type>';
            }

            postTags = post.tags;

            for (i = 0; i < postTags.length; i++) {
                xmlString += '<category domain="post_tag" nicename="' + postTags[i].slug + '"><![CDATA[' + postTags[i].name + ']]></category>'
            }

            // console.log(postDate.getUTCFullYear())

            // postDateString = "" + postDate.getUTCFullYear() + "-" + (postDate.getUTCMonth() + 1) + "-" + postDate.getUTCDate() +  " " + postDate.getUTCHours() + ":" + postDate.getUTCMinutes() + ":" + postDate.getUTCSeconds();

            postDateString = postDate.toISOString().replace('T', ' ').substring(0, postDate.toISOString().indexOf('.'));

            xmlString += '<wp:post_date>' + postDateString + '</wp:post_date><wp:post_date_gmt>' + postDateString + '</wp:post_date_gmt>';

            xmlString += '</item>\n';

        }
        xmlString += '</channel></rss>'
        // console.log(xmlString);

        document.getElementById("xmlResult").value = xmlString;

    }
