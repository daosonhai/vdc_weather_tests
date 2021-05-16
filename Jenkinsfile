node('master') {
    try {        
        stage('Installing NPM Package') {
            bat label: 'Installing npm package', script: 'npm install'
        }

        stage('Clearing test environment') {
            bat label: 'Deleting Cypress Cache', script: 'npm run cy:cache:delete'
            bat label: 'Removing previous reports', script: 'npm run cy:report:remove'            
        }

        stage('Executing all automated tests') {
            parallel(                
                'Machine 1': {
                    bat label: 'Machine 1 executes TCs on Chrome', script: "npx cypress run --spec 'cypress/Tests/*' --browser chrome"
                },                
                'Machine 2': {
                    bat label: 'Machine 2 executes TCs on Firefox', script: "npx cypress run --spec 'cypress/Tests/*' --browser firefox"
                },
                'Machine 3': {
                    bat label: 'Machine 3 executes TCs on MS Edge', script: "npx cypress run --spec 'cypress/Tests/*' --browser edge"
                }                
            )
        }
    }
    catch (e) {
    }
    finally {
        bat label: 'Combine JSON reports', script: 'npm run cy:report:combine'
        bat label: 'Generate final report', script: 'npm run cy:report:generate'        
    }
}