# Executable-style acceptance criteria for {{project.name}}.
#
# The value of writing criteria this way is not the tooling — you do not need a Gherkin runner for
# it to pay off. It is that Given/When/Then forces you to name the starting state, the single
# action, and one specific observable result. A criterion that cannot be phrased this way is
# usually a criterion that could not have failed.
#
# Replace this file with real scenarios. It is here as a shape to copy.

Feature: TODO(setup) — the capability being described

  Background:
    Given a system in a known starting state

  # The ordinary case. Note the specific value in the Then — not "a total is returned".
  Scenario: The expected path produces the expected value
    Given <a precise starting condition>
    When <one action is taken>
    Then the result is exactly <a specific value>

  # Boundaries come in pairs. One scenario per side, never a single scenario with "or".
  Scenario Outline: Behaviour at the boundary
    Given <a precise starting condition>
    When the input is <input>
    Then the result is <result>

    Examples:
      | input  | result |
      | 9999   | TODO   |
      | 10000  | TODO   |
      | 10001  | TODO   |

  # The error path. Most incidents live here and most acceptance criteria ignore it.
  Scenario: The failure is specific and safe to retry
    Given <a precise starting condition>
    When <the action fails partway through>
    Then no partial state is left behind
    And repeating the action produces the same result as succeeding once
