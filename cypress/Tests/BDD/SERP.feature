Feature: Test SERP on negative scenario
    Test SERP page on negative Test

    Scenario: Verify a hint is displayed when no cities are found
        Given I visit OpenWeather page
        When I enter an weird <keyword>
        And I click the Search button
        Then I see a hint message as following result table
            | keyword   | result   |
            | <keyword> | <result> |

        Examples:
            | keyword      | result     |
            | melbourne au | Not found. |
            | hochiminh    | Not found. |