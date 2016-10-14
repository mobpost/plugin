   var postTitle = new Array();
   var postUrl = new Array();
   var postDate = new Array();
   var postSum = new Array();
   var postLabels = new Array();
   var sortBy = "datenewest";
   var tocLoaded = false;
   var numChars = 250;
   var postFilter = '';
   var tocdiv = document.getElementById("blomap");
   var totalEntires =0;
   var totalPosts =0;

function loadpost(json) {

   function getPostData() {
      if ("entry" in json.feed) {
         var numEntries = json.feed.entry.length;
         totalEntires = totalEntires + numEntries;
         totalPosts=json.feed.openSearch$totalResults.$t
         if(totalPosts>totalEntires)
         {
         var nextjsoncall = document.createElement('script');
         nextjsoncall.type = 'text/javascript';
         startindex=totalEntires+1;
         nextjsoncall.setAttribute("src", "/feeds/posts/summary?start-index=" + startindex + "&max-results=500&alt=json-in-script&callback=loadpost");
         tocdiv.appendChild(nextjsoncall);
         }

         for (var i = 0; i < numEntries; i++) {
            var entry = json.feed.entry[i];
            var posttitle = entry.title.$t;
            var postdate = entry.published.$t.substring(0,10);
            var posturl;
            for (var k = 0; k < entry.link.length; k++) {
               if (entry.link[k].rel == 'alternate') {
               posturl = entry.link[k].href;
               break;
               }
            }
            if ("content" in entry) {
               var postcontent = entry.content.$t;}
            else
               if ("summary" in entry) {
                  var postcontent = entry.summary.$t;}
               else var postcontent = "";
            var re = /<\S[^>]*>/g; 
            postcontent = postcontent.replace(re, "");
            if (postcontent.length > numChars) {
               postcontent = postcontent.substring(0,numChars);
               var quoteEnd = postcontent.lastIndexOf(" ");
               postcontent = postcontent.substring(0,quoteEnd) + '...';
            }
            var pll = '';
            if ("category" in entry) {
               for (var k = 0; k < entry.category.length; k++) {
                  pll += '<a href="javascript:filterPosts(\'' + entry.category[k].term + '\');" title="Klik untuk semua artikel dengan label \'' + entry.category[k].term + '\'">' + entry.category[k].term + '</a>,  ';
               }
            var l = pll.lastIndexOf(',');
            if (l != -1) { pll = pll.substring(0,l); }
            }
            postTitle.push(posttitle);
            postDate.push(postdate);
            postUrl.push(posturl);
            postSum.push(postcontent);
            postLabels.push(pll);
         }
      }
      if(totalEntires==totalPosts) {tocLoaded=true;showToc();}
   }

   getPostData();
   sortPosts(sortBy);
   tocLoaded = true;
}

function filterPosts(filter) {
   postFilter = filter;
   displayToc(postFilter);
}

function allPosts() {
   postFilter = '';
   displayToc(postFilter);
}

function sortPosts(sortBy) {
   function swapPosts(x,y) {
      var temp = postTitle[x];
      postTitle[x] = postTitle[y];
      postTitle[y] = temp;
      var temp = postDate[x];
      postDate[x] = postDate[y];
      postDate[y] = temp;
      var temp = postUrl[x];
      postUrl[x] = postUrl[y];
      postUrl[y] = temp;
      var temp = postSum[x];
      postSum[x] = postSum[y];
      postSum[y] = temp;
      var temp = postLabels[x];
      postLabels[x] = postLabels[y];
      postLabels[y] = temp;
   }

   for (var i=0; i < postTitle.length-1; i++) {
      for (var j=i+1; j<postTitle.length; j++) {
         if (sortBy == "titleasc") { if (postTitle[i] > postTitle[j]) { swapPosts(i,j); } }
         if (sortBy == "titledesc") { if (postTitle[i] < postTitle[j]) { swapPosts(i,j); } }
         if (sortBy == "dateoldest") { if (postDate[i] > postDate[j]) { swapPosts(i,j); } }
         if (sortBy == "datenewest") { if (postDate[i] < postDate[j]) { swapPosts(i,j); } }
      }
   }
}

function displayToc(filter) {
   var numDisplayed = 0;
   var tocTable = '';
   var tocHead1 = 'JUDUL POST';
   var tocTool1 = 'Sortir menurut judul';
   var tocHead2 = 'TANGGAL';
   var tocTool2 = 'Sortir menurut tanggal';
   var tocHead3 = 'LABEL/TAG';
   var tocTool3 = '';
   if (sortBy == "titleasc") { 
      tocTool1 += ' (descending)';
      tocTool2 += ' (newest first)';
   }
   if (sortBy == "titledesc") { 
      tocTool1 += ' (ascending)';
      tocTool2 += ' (newest first)';
   }
   if (sortBy == "dateoldest") { 
      tocTool1 += ' (ascending)';
      tocTool2 += ' (newest first)';
   }
   if (sortBy == "datenewest") { 
      tocTool1 += ' (ascending)';
      tocTool2 += ' (oldest first)';
   }
   if (postFilter != '') {
      tocTool3 = 'Tampilkan semua artikel';
   }
   tocTable += '<table class="mob-table-all mob-hoverable">';
   tocTable += '<tr class="mob-deep-orange">';
   tocTable += '<th class="mob-text-white">';
   tocTable += '<a href="javascript:toggleTitleSort();" data-toggle="tooltip" data-placement="top" title="' + tocTool1 + '">' + tocHead1 + '</a>';
   tocTable += '</th>';
   tocTable += '<th class="mob-text-white">';
   tocTable += '<a href="javascript:toggleDateSort();" data-toggle="tooltip" data-placement="top" title="' + tocTool2 + '">' + tocHead2 + '</a>';
   tocTable += '</th>';
   tocTable += '<th class="mob-text-white">';
   tocTable += '<a href="javascript:allPosts();" data-toggle="tooltip" data-placement="top" title="' + tocTool3 + '">' + tocHead3 + '</a>';
   tocTable += '</th>';
   tocTable += '</tr>';
   for (var i = 0; i < postTitle.length; i++) {
      if (filter == '') {
         tocTable += '<tr><td><a href="' + postUrl[i] + '" title="' + postSum[i] + '">' + postTitle[i] + '</a></td><td>' + postDate[i] + '</td><td>' + postLabels[i] + '</td></tr>';
         numDisplayed++;
      } else {
          z = postLabels[i].lastIndexOf(filter);
          if ( z!= -1) {
             tocTable += '<tr><td><a href="' + postUrl[i] + '" title="' + postSum[i] + '">' + postTitle[i] + '</a></td><td>' + postDate[i] + '</td><td>' + postLabels[i] + '</td></tr>';
             numDisplayed++;
          }
        }
   }
   tocTable += '</table>';
   if (numDisplayed == postTitle.length) {
      var tocNote = '<span class="toc-note">Displaying all ' + postTitle.length + ' posts<br/></span>'; }
   else {
      var tocNote = '<span class="toc-note">Displaying ' + numDisplayed + ' posts labeled \'';
      tocNote += postFilter + '\' of '+ postTitle.length + ' posts total<br/></span>';
   }
   tocdiv.innerHTML = tocNote + tocTable;
} // end of displayToc

function toggleTitleSort() {
   if (sortBy == "titleasc") { sortBy = "titledesc"; }
   else { sortBy = "titleasc"; }
   sortPosts(sortBy);
   displayToc(postFilter);
} // end toggleTitleSort

function toggleDateSort() {
   if (sortBy == "datenewest") { sortBy = "dateoldest"; }
   else { sortBy = "datenewest"; }
   sortPosts(sortBy);
   displayToc(postFilter);
} // end toggleTitleSort


function showToc() {
  if (tocLoaded) { 
     displayToc(postFilter);
     var toclink = document.getElementById("toclink");
   
  }
  else { alert("Please wait..."); }
}

function hideToc() {
  var tocdiv = document.getElementById("toc");
  tocdiv.innerHTML = '';
  var toclink = document.getElementById("toclink");
  toclink.innerHTML = '<a href="#" onclick="scroll(0,0); showToc(); Effect.toggle('+"'toc-result','blind');"+'">» Show Table of Contents</a> <img src="http://chenkaie.blog.googlepages.com/new_1.gif"/>';
}
