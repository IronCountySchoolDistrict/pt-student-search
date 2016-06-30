/* global studentQuery */
require(['jquery', 'underscore', 'bluebird', 'datatables', 'datatables.jqueryui'], ($, _, Promise) => {
  var fetchingResultsTemplate = fetch('/scripts/pt-student-search/html/results.html', {
      credentials: 'include'
    })
    .then(response => response.text());

  var fetchingResults = fetch('/ws/schema/query/org.irondistrict.ptsearch.queries.search', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query_str: studentQuery // see PTsearchResults.html for initialization of this var
      })
    })
    .then(response => response.json());

  Promise.all([fetchingResultsTemplate, fetchingResults])
    .then(results => {
      var resultsTemplate = results[0];
      var results = results[1].record;

      var compiledTemplate = _.template(resultsTemplate);
      var renderedTemplate = compiledTemplate({
        results: results,
        studentQuery: studentQuery
      });

      $('h1:contains("Student Search Results")').after(renderedTemplate);

      $('#students').dataTable({
        'oLanguage': {
          'sEmptyTable': 'No students matched your request'
        },
        // Make the 'Submit Log Entry' column non-sortable.
        'aoColumns': [
          null,
          null,
          null, {
            'bSortable': false
          }, {
            'bSortable': false
          }
        ],
        'bProcessing': true,
        'bPaginate': false,
        'bFilter': true,
        'bJQueryUI': true
      });
      $('#students_wrapper').css('display', 'inline-block');
    })

});
