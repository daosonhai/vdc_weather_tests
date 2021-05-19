Feature: Test SERP on negative scenario
    Test SERP page on negative Test
    
    Scenario: Verify a hint is displayed when no cities are found
        Given I visit OpenWeather page
        When I enter an weird "keyword"        
        Then A hint message is displayed for me