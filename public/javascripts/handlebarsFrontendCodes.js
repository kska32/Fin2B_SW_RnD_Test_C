
function handlebarsRender(context){
        Handlebars.registerHelper('items', function(items, options) {
            var out = "<div class='searchResultsInside'>";
            for(var i=0, l=items.length; i<l; i++) {
                let itemx = options.fn(items[i]).replace(/\n|<b>|<\/b>/gi,"");
                out = out + "<div class='searchResultsItem'>" + itemx + "</div>";
            }
            return out + "</div>";
        });

        Handlebars.registerHelper('json', function(context) {
            return JSON.stringify(context);
        });
        
        let source = `
            {{#items items}}
                <a class="title" href={{link}} target='blank'>{{{htmlTitle}}}</a>
                <div class="displaylink" >{{{displayLink}}}</div>
                <span class="snippet">{{{htmlSnippet}}}</span>
            {{/items}}
            <button class='nextpage btn btn-success' onclick='nextPage(event,{{json queries}})'>NEXT PAGE</button>
        `;

        let template = Handlebars.compile(source);
        let html = template(context);

        document.querySelector(".searchResult").innerHTML = html;
}

function nextPage(event,queries){
        let key = "AIzaSyDE7k8lIGIteWbLs4ShuoBwYm1Ld3JyC_0";
        let cx = "006302910569569867484:4derhzxxwny";
        let next = queries.nextPage[0];
        
        let nextPageUrl = `https://www.googleapis.com/customsearch/v1/siterestrict`+
              `?key=${key}`+
              `&cx=${cx}`+
              `&q=${next.searchTerms}`+
              `&num=${next.count}`+ 
              `&start=${next.startIndex}`;
    
              //nextPageRender(jsonData);
        event.target.disabled = true;
        myAjax("GET", nextPageUrl, {}, (xhr)=>{
            event.target.disabled = false;
            let r = JSON.parse(xhr.responseText);
            nextPageRender(r);
        });
}

function nextPageRender(context){
        Handlebars.registerHelper('nextpageItems', function(items, options) {
            var out = "";
            for(var i=0, l=items.length; i<l; i++) {
                let itemx = options.fn(items[i]).replace(/\n|<b>|<\/b>/gi,"");
                out = out + "<div class='searchResultsItem'>" + itemx + "</div>";
            }
            return out;
        });

        let source = `
            {{#nextpageItems items}}
                <a class="title" href={{link}} target='blank'>{{{htmlTitle}}}</a>
                <div class="displaylink" >{{{displayLink}}}</div>
                <span class="snippet">{{{htmlSnippet}}}</span>
            {{/nextpageItems}}
        `;

        let template = Handlebars.compile(source);
        let html = template(context);
        document.querySelector(".searchResultsInside").innerHTML += html;

        document.querySelector(".nextpage")
            .setAttribute("onclick",`nextPage(event,`+ JSON.stringify(context.queries)+`)`);
}