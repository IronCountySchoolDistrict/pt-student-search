/* global studentQuery */
import $ from 'jquery';
import _ from 'underscore';
import Promise from 'bluebird';
import datatables from 'datatables';
import datatablesJqueryUi from 'datatables.jqueryui';

export default function() {
  var getResultsTemplateAsync = fetch('/scripts/pt-student-search/html/results.html', {
      credentials: 'include'
    })
    .then(response => response.text());

  var getSearchResultsAsync = fetch(`/teachers/Ptsearch.pshtml.json?query_str=${studentQuery}&curschoolid=${currentSchoolId}`, {
      method: 'GET',
      credentials: 'include'
    })
    .then(response => response.json());

  Promise.all([getResultsTemplateAsync, getSearchResultsAsync])
    .then(results => {
      var resultsTemplate = results[0];
      var results = results[1];

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
          null,
          {
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
}
