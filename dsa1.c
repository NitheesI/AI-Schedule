/*
    Palindrome check
    Time Complexity: O(n)
    Space Complexity: O(n)
*/

#include <stdio.h>
#include <stdlib.h>

/* Node for singly linked list */
struct Node {
    int data;
    struct Node *next;
};

/* Array-based stack */
struct Stack {
    int *data;
    int top;
    int capacity;
};

struct Node *createNode(int value)
{
    struct Node *newNode = malloc(sizeof(struct Node));

    if (newNode == NULL) {
        printf("Memory allocation failed.\n");
        exit(EXIT_FAILURE);
    }

    newNode->data = value;
    newNode->next = NULL;

    return newNode;
}

void push(struct Stack *stack, int value)
{
    stack->data[stack->top++] = value;
}

int pop(struct Stack *stack)
{
    return stack->data[--stack->top];
}

void freeList(struct Node *head)
{
    struct Node *temp;

    while (head != NULL) {
        temp = head;
        head = head->next;
        free(temp);
    }
}

int main(void)
{
    int n;
    int *array = NULL;
    struct Node *head = NULL;
    struct Node *tail = NULL;
    struct Node *current;
    struct Stack stack;
    int i;
    int isPalindrome = 1;
	
	printf("Number of values to be stored : ");
    scanf("%d", &n);

    /*Handle n = 0.*/
    if (n <= 0) {
        printf("NOT A PALINDROME\n");
        return 0;
    }

    /* Allocate array */
    array = malloc(n * sizeof(int));

    if (array == NULL) {
        printf("Memory allocation failed.\n");
        return EXIT_FAILURE;
    }

    /* Read integers */
    printf("Enter the values :");
    for (i = 0; i < n; i++) {
        scanf("%d", &array[i]);
    }

    /* Initialize stack */
    stack.capacity = n;
    stack.top = 0;
    stack.data = malloc(stack.capacity * sizeof(int));

    if (stack.data == NULL) {
        printf("Memory allocation failed.\n");
        free(array);
        return EXIT_FAILURE;
    }

    /* Build linked list from array */
    for (i = 0; i < n; i++) {
        struct Node *newNode = createNode(array[i]);

        if (head == NULL) {
            head = newNode;
            tail = newNode;
        } else {
            tail->next = newNode;
            tail = newNode;
        }
    }

    /* Push every value onto the stack during first traversal */
    current = head;

    while (current != NULL) {
        push(&stack, current->data);
        current = current->next;
    }

    /* Second traversal: compare with values popped from stack */
    current = head;

    while (current != NULL) {
        if (current->data != pop(&stack)) {
            isPalindrome = 0;
            break;
        }

        current = current->next;
    }

    if (isPalindrome) {
        printf("PALINDROME\n");
    } else {
        printf("NOT A PALINDROME\n");
    }

    /* Free all allocated memory */
    freeList(head);
    free(stack.data);
    free(array);

    return 0;
}

/*
    Memory Leak Testing:
    ---------------------

    The program was compiled using:

        gcc -Wall -Wextra -g palindrome.c -o palindrome

    The program was tested for memory leaks using Valgrind:

        valgrind --leak-check=full --show-leak-kinds=all ./palindrome

    Test Input:
        6
        1 2 3 3 2 1

    Expected Output:
        PALINDROME

    Expected Valgrind Result:
        in use at exit: 0 bytes in 0 blocks
        definitely lost: 0 bytes in 0 blocks
        indirectly lost: 0 bytes in 0 blocks
        possibly lost: 0 bytes in 0 blocks
        still reachable: 0 bytes in 0 blocks
        ERROR SUMMARY: 0 errors

    This confirms that all dynamically allocated memory for the
    array, stack, and linked-list nodes is properly freed and
    that the program has no memory leaks.
*/
