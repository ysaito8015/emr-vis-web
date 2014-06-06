'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
  .controller('MainCtrl', ['$scope', '$http', function($scope, $http) {
    /*
     * App config
     */

    //TODO: Move them to configs - affects perf
    $scope.classificationName = {"positive": "True", "negative": "False"};

    $scope.variables = ["any-adenoma", "appendiceal-orifice", "asa", "biopsy", "cecum",
              "ileo-cecal-valve", "indication-type", "infomed-consent", 
              "nursing-report", "no-prep-adequate", "not-prep-adequate",
              "yes-prep-adequate", "proc-aborted", "widthdraw-time"]

    /*
     * Main grid
     */
    
    $scope.activeVariable = "asa";
    $scope.activeDoc = null;
    $scope.activeDocIndex = null;
    $scope.showGrid = true;

    $scope.appLoading = true;
    $scope.appDisabled = false;

    $http.get("dummy-grid.json")
        .success(function(data, status) {
            $scope.gridData = data;
            
            //Show first report in the set
            $scope.activeDocIndex = 0;
            $scope.activeDoc = $scope.gridData[0].id;
            $scope.loadReport($scope.activeDoc);
            
        })
        .error(function() { alert("Could not load grid data!"); });

    $http.get("dummy-variable.json")
        .success(function(data, status) {
            $scope.variableData = data;
            $scope.loadDistribution($scope.activeVariable);
        })
        .error(function() { alert("Could not load variable data!"); });

    $scope.styleGridCell = function(classification, confidence) {
        if (classification == "positive") {
            if (confidence > 0.5) 
                return "cert1-pos";
            else
                return "cert0-pos";
        }
        else {
            if (confidence > 0.5) 
                return "cert1-neg";
            else
                return "cert0-neg";
        }
    }

    $scope.updateGrid = function(variable, activeDoc, activeDocIndex) {
        // console.log(variable, activeDoc);

        $("#cell-"+$scope.activeVariable+"-"+$scope.activeDoc)
                        .removeClass("selected")

        if(variable != $scope.variable) {
          $scope.activeVariable = variable;
          $scope.loadDistribution(variable);
        }

        if(activeDocIndex != $scope.activeDocIndex) {
          $scope.activeDoc = activeDoc;
          $scope.activeDocIndex = activeDocIndex;
          $scope.loadReport(activeDoc);
          $scope.setActiveDoc(activeDoc);
        }
    }

    /*
     * Load reports
     */

    //TODO: Load reports not as variables but as docs
    $scope.loadReport = function(activeDoc) {
        $scope.reportPath = "docs/"+ activeDoc +"/report.txt";
        $scope.pathologyPath = "docs/"+ activeDoc +"/pathology.txt";

        $scope.reportText = null;

        $scope.reportExists = false;
        $scope.pathologyExists = false;

        $scope.appLoading = true;

        //report
        $http.get($scope.reportPath)
            .success(function(data, status) {
                $scope.reportText = data;
                $scope.reportExists = true;

                //Find in gridData
                $("#cell-"+$scope.activeVariable+"-"+$scope.activeDoc)
                .addClass("selected")

                $scope.appLoading = false;
            })
            .error(function(data, status, headers, config) {
                $scope.reportText = "Status " + status
                alert($scope.reportPath + " is not accessible. Make sure you have the docs/ folder in the app/ directory.");

                $scope.appLoading = false;
            });

        // pathology
        $http.get($scope.pathologyPath)
            .success(function(data, status) {
                $scope.pathologyText = data;
                $scope.pathologyExists = true;
            })
    };

    /*
     * Pie chart
     */

    $scope.pieData = [
        {name: "!#def", count: 1, classification: "positive"},
     ]; 

    $scope.loadDistribution = function(variable) {
        $scope.pieData = [
          {name: $scope.classificationName["positive"], count: $scope.variableData[variable]["numPositive"], classification: "positive"},
          {name: $scope.classificationName["negative"], count: $scope.variableData[variable]["numNegative"], classification: "negative"},
        ];

        $scope.pieData.sort(function(first, second) {
          return second.count - first.count;
        });

    }

  }])

  // }])
  .controller('TabsDemoCtrl', ['$scope', function($scope) {
      // $scope.tabs = [
      //   { title:'WordTree View', content:'Dynamic content 1' },
      //   { title:'Review Feedback <span class="badge pull-right">42</span>', content:'Dynamic content 2', disabled: true }
      // ];

      $scope.numFeedback = 42;

      $scope.alertMe = function() {
        $scope.numFeedback = 0;
        setTimeout(function() {
          alert('Re-training!');
        });
      };
   }]);
