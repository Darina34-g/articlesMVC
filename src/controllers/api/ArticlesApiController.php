<?php

namespace src\controllers\api;

use src\models\Article;
use src\models\User;
use src\exceptions\NotFoundException;
use src\exceptions\UnauthorizedException;
use src\exceptions\InvalidArgumentException;
use src\controllers\Controller;
class ArticlesApiController extends Controller
{
    public function all()
    {
        $articles = Article::findAll();
        $this->view->displayJson(['articles' => $articles]);
    }
    public function view($id)
    {
        $article = Article::getById($id);
        if ($article !== null) {
            $this->view->renderHtml('articles/view.php', ['article' => $article]);
        } else {
            throw new NotFoundException();
        }

    }
    public function edit($id)
    {
        $article = Article::getById($id);
        if ($article === null) {
            throw new NotFoundException();
        }
        if ($this->user === null) {
            throw new UnauthorizedException();
        }
        if (!empty($_POST)) {
            try {
                $article->updateFromArray($_POST, $_FILES['img'], $this->user);
                header("Location: /iv1-23-1.loc/article/{$article->getId()}");
                exit;
            } catch (InvalidArgumentException $e) {
                $this->view->renderHtml('articles/edit.php', ['error' => $e->getMessage()]);
                return;
            }
        }
        $this->view->renderHtml('articles/edit.php', ['article' => $article]);
    }
    public function add()
    {
        // if($this->user === null){
        //     throw new UnauthorizedException();
        // }
        $user = User::getById(1);
        $input = $this->getInputData();
        $articleFromRequest = $input['articles'][0];
        $article = Article::create( $articleFromRequest, ['size' => 0], $user);
        $this->view->displayJson(['result' => 'OK']);
    }
   public function delete($id)
{
    $article = Article::getById($id);
    if ($article === null) {
        throw new NotFoundException();
    }

    $article->delete();

    $this->view->displayJson(['result' => 'OK']);
}

    public function search()
    {
        if (empty($_GET['q'])) {
            $this->view->renderHtml('articles/search.php');
            return;
        } else {
            $articles = Article::searchByName($_GET['q']);
            $this->view->renderHtml('articles/search.php', ['articles' => $articles]);
        }
    }
}